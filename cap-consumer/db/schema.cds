namespace myapp;

entity Mensajes {
    key ID : UUID;
    queue  : String;
    message: String;
}
