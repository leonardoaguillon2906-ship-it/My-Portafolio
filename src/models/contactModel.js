// Simulación de interacción con base de datos (puedes conectar tu pool de pg o mysql aquí)
const messagesDb = []; 

class ContactModel {
    static async saveMessage(name, email, message) {
        const newMessage = {
            id: messagesDb.length + 1,
            name,
            email,
            message,
            date: new Date().toLocaleString()
        };
        messagesDb.push(newMessage);
        return newMessage;
    }

    static async getAllMessages() {
        return messagesDb;
    }
}

module.exports = ContactModel;