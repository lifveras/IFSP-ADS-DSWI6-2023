const database = require("../../database/TempDatabase");
const ItemPatrimonio = require("../../database/model/ItemPatrimonio");
const ItemRepoSeed = require("../../database/seed/ItemPatrimonioSeed");

class ItemPatrimonioRepository{
    constructor(){
        // Quando definirmos o ORM, precisaremos adicionar o model aqui.
        // this.model = ItemPatrimonioModel;
        ItemRepoSeed(database); // Popula o nosso banco de dados temporário
        this.database = database;
    }

    async create(itemPatrimonio){
        const newItem = new ItemPatrimonio(itemPatrimonio);
        database.addItem(newItem);
        return newItem;
    }

    async find(itemPatrimonio){
        return database.findByPatrimonio(itemPatrimonio);
    }

    async all(){
        return database.getAllItems();
    }

    async remove(patrimonioId){
        return database.removeByPatrimonio(patrimonioId);
    }
}

module.exports = new ItemPatrimonioRepository();
