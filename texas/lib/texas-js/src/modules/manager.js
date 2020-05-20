const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

class Manager {
    constructor(config, client) {
        this.config = config;
        this.client = client;
        const DB = require(`../connectors/${config.connector.name}`);

        this.db = new DB(config.connector.config);
    }

    close() {
        this.db.close();
    }

    //Query -------------------------------------------------------------------------
    Users() {
        return this.db.users.find();
    }

    Datasets(viwer) {
        return this.db.datasets.find();
    }
    Dataset(viwer, ID) {
        return this.db.datasets.get(ID);
    }

    //Mutations User -------------------------------------------------------------------------
    async createUser(user) {
        user.Password = await bcrypt.hash(user.Password, saltRounds);
        let result = this.db.users.create(user);
        return result;
    }

    async validateJWT(token) {
        try {
            let decoded = jwt.verify(token, this.config.auth_secret);
            if (decoded.ID) {
                return this.db.users.get(decoded.ID);
            } else {
                return decoded;
            }
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    async signIn(email, password) {
        const result = await this.db.users.by("Email", email);
        if (!result || !result.Email)
            throw new Error("User or password invalid");

        let isPasswordRight = await bcrypt.compare(password, result.Password);
        if (isPasswordRight) {
            let token = jwt.sign({ ID: result.ID }, this.config.auth_secret, {
                expiresIn: "50h"
            });
            return { token: token };
        }
        throw new Error("User or password invalid");
    }

    async guestSession(guest) {
        let token = jwt.sign(
            { Guest: guest, Type: "GUEST" },
            this.config.auth_secret,
            {
                expiresIn: "50h"
            }
        );
        return { token: token };
    }

    async addGroupUser(email, group) {
        const user = await this.db.users.by("Email", email);
        if (!user) throw new Error("User not found");
        let groups = user.Groups || [];
        if (!groups.find(g => g === group)) {
            groups.push(group);
            user.Groups = groups;
            return this.db.users.update(user);
        } else {
            return user;
        }
    }

    //Mutations Dataset -------------------------------------------------------------------
    async createDataset(viwer, dataset) {
        return this.db.datasets.create(dataset);
    }

    async deleteDataset(viwer, ID) {
        let result = this.db.datasets.delete(ID);
        return result;
    }
}

module.exports = Manager;
