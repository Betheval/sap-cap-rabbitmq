using myapp from '../db/schema';

service MensajeriaService {
    entity Mensajes as projection on myapp.Mensajes;
    action sendMessage(queue: String, message: String) returns String;
}
