const cds = require('@sap/cds');
const amqp = require('amqplib');

module.exports = cds.service.impl(async function () {
    const queue = 'myQueue'; // Nombre de la cola en RabbitMQ

    async function consumeMessages() {
        try {
            // Conectar a RabbitMQ
            const connection = await amqp.connect('amqp://localhost');
            const channel = await connection.createChannel();
            await channel.assertQueue(queue, { durable: false });

            console.log(`📥 [SAP CAP] Esperando mensajes en la cola: ${queue}...`);

            // Consumir mensajes de la cola
            channel.consume(queue, async (msg) => {
                if (msg !== null) {
                    const messageContent = msg.content.toString();
                    console.log(`✅ Mensaje recibido: ${messageContent}`);

                    // Aquí puedes procesar el mensaje, por ejemplo, guardarlo en la base de datos
                    const db = await cds.connect.to('db');
                    await db.run(INSERT.into('Mensajes').entries({
                        ID: cds.utils.uuid(),
                        queue: queue,
                        message: messageContent
                    }));

                    // Confirmar procesamiento del mensaje
                    channel.ack(msg);
                }
            });

        } catch (error) {
            console.error('❌ Error en el consumidor de RabbitMQ:', error);
        }
    }

    // Ejecutar el consumidor cuando arranque el servicio CAP
    consumeMessages();
});
