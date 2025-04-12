const cds = require('@sap/cds');
const amqp = require('amqplib');

module.exports = cds.service.impl(async function () {

    this.on('sendMessage', async (req) => {
        const { queue, message } = req.data;
        
        try {
            // Conectar a RabbitMQ
            const connection = await amqp.connect('amqp://localhost');
            const channel = await connection.createChannel();
            await channel.assertQueue(queue, { durable: false });

            console.log(`📤 Enviando mensaje a ${queue}...`);

            // Enviar el mensaje a la cola una vez
            channel.sendToQueue(queue, Buffer.from(message));
            console.log(`📤 Mensaje enviado a ${queue}: ${message}`);

            // Cerrar conexión
            await channel.close();
            await connection.close();
            console.log('🔌 Conexión cerrada');

            return `Mensaje enviado a ${queue}`;
        } catch (error) {
            console.error('❌ Error enviando mensaje:', error);
            return 'Error al enviar el mensaje';
        }
    });
    

});
