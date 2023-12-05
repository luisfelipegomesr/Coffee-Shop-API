const express = require("express");
const { Client } = require('pg');
const cors = require("cors");
const bodyparser = require("body-parser");
const config = require("./config");

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyparser.json());

var conString = config.urlConnection;
var client = new Client(conString);
client.connect((err) => {
    if (err) {
        return console.error('Não foi possível conectar ao banco.', err);
    }
    client.query('SELECT NOW()', (err, result) => {
        if (err) {
            return console.error('Erro ao executar a query.', err);
        }
        console.log(result.rows[0]);
    });
});

app.get("/", (req, res) => {
    console.log("Response ok.");
    res.send("Rotas: \n " + "/cardapio -> para listar o cardápio. \n" + "/cardapio/id -> para listar um café pelo código do id \n");
});

app.get("/cardapio", (req, res) => {
    try {
        client.query("SELECT * FROM Cardapio", function
            (err, result) {
            if (err) {
                return console.error("Erro ao executar a qry de SELECT", err);
            }
            res.send(result.rows);
            console.log("Chamou get cardapio");
        });
    } catch (error) {
        console.log(error);
    }
});

app.get("/cardapio/:id", (req, res) => {
    try {
        console.log("Chamou /:id " + req.params.id);
        client.query(
            "SELECT * FROM cardapio WHERE id = $1",
            [req.params.id],
            function (err, result) {
                if (err) {
                    return console.error("Erro ao executar a qry de SELECT id", err);
                }
                if (result.rows.length == 0) {
                    res.send("O café com o código: " + req.params.id + "não existe no banco de dados.")
                }
                else {
                    res.send(result.rows);
                    //console.log(result);
                }
            }
        );
    } catch (error) {
        console.log(error);
    }
});

app.delete("/cardapio/:id", (req, res) => {
    try {
        console.log("Chamou delete /:id " + req.params.id);
        const id = req.params.id;
        client.query(
            "DELETE FROM cardapio WHERE id = $1",
            [id],
            function (err, result) {
                if (err) {
                    return console.error("Erro ao executar a qry de DELETE", err);
                } else {
                    if (result.rowCount == 0) {
                        res.status(404).json({ info: "Registro não encontrado." });
                    } else {
                        res.status(200).json({ info: `Registro excluído. Código: ${id}` });
                    }
                }
                console.log(result);
            }
        );
    } catch (error) {
        console.log(error);
    }
});

app.post("/cardapio", (req, res) => {
    try {
        console.log("Alguém enviou um post com os dados:", req.body);
        const {title, size, data, price, imgpath} = req.body;
        client.query(
            "INSERT INTO cardapio (title, size, data, price, imgpath) VALUES ($1, $2, $3, $4, $5) RETURNING * ",
            [title, size, data, price, imgpath],
            function (err, result) {
                if (err) {
                    return console.error("Erro ao executar a qry de INSERT", err);
                }
                const { id } = result.rows[0];
                res.setHeader("id", `${id}`);
                res.status(201).json(result.rows[0]);
                console.log(result);
            }
        );
    } catch (erro) {
        console.error(erro);
    }
});

app.put("/cardapio/:id", (req, res) => {
    try {
        console.log("Alguém enviou um update com dados", req.body);
        const id = req.params.id;
        const {title, size, data, price, imgpath} = req.body;
        client.query(
            "UPDATE cardapio SET title=$1, size=$2, data=$3, price=$4, imgpath=$5 WHERE id =$6 ",
            [title, size, data, price, imgpath, id],
            function (err, result) {
                if (err) {
                    return console.error("Erro ao executar a qry de UPDATE", err);
                } else {
                    res.setHeader("id", id);
                    res.status(202).json({ "id": id });
                    console.log(result);
                }
            }
        );
    } catch (erro) {
        console.error(erro);
    }
});

//parte dos usuarios

app.get("/usuarios", (req, res) => {
    try {
        client.query("SELECT * FROM usuarios", function
            (err, result) {
            if (err) {
                return console.error("Erro ao executar a qry de SELECT", err);
            }
            res.send(result.rows);
            console.log("Chamou get usuarios");
        });
    } catch (error) {
        console.log(error);
    }
});

app.get("/usuarios/:id", (req, res) => {
    try {
        console.log("Chamou /:id " + req.params.id);
        client.query(
            "SELECT * FROM usuarios WHERE id = $1",
            [req.params.id],
            function (err, result) {
                if (err) {
                    return console.error("Erro ao executar a qry de SELECT id", err);
                }
                if (result.rows.length == 0) {
                    res.send("O usuário com o código: " + req.params.id + "não existe no banco de dados.")
                }
                else {
                    res.send(result.rows);
                    //console.log(result);
                }
            }
        );
    } catch (error) {
        console.log(error);
    }
});

app.delete("/usuarios/:id", (req, res) => {
    try {
        console.log("Chamou delete /:id " + req.params.id);
        const id = req.params.id;
        client.query(
            "DELETE FROM usuarios WHERE id = $1",
            [id],
            function (err, result) {
                if (err) {
                    return console.error("Erro ao executar a qry de DELETE", err);
                } else {
                    if (result.rowCount == 0) {
                        res.status(404).json({ info: "Registro não encontrado." });
                    } else {
                        res.status(200).json({ info: `Registro excluído. Código: ${id}` });
                    }
                }
                console.log(result);
            }
        );
    } catch (error) {
        console.log(error);
    }
});

app.post("/usuarios", (req, res) => {
    try {
        console.log("Alguém enviou um post com os dados:", req.body);
        const { usuario, email, senha } = req.body;
        client.query(
            "INSERT INTO Usuarios (usuario, email, senha) VALUES ($1, $2, $3) RETURNING * ",
            [usuario, email, senha],
            function (err, result) {
                if (err) {
                    return console.error("Erro ao executar a qry de INSERT", err);
                }
                const { id } = result.rows[0];
                res.setHeader("id", `${id}`);
                res.status(201).json(result.rows[0]);
                console.log(result);
            }
        );
    } catch (erro) {
        console.error(erro);
    }
});

app.put("/usuarios/:id", (req, res) => {
    try {
        console.log("Alguém enviou um update com dados", req.body);
        const id = req.params.id;
        const { usuario, email, senha } = req.body;
        client.query(
            "UPDATE Usuarios SET nome=$1, email=$2, senha=$3 WHERE id =$4 ",
            [usuario, email, senha, id],
            function (err, result) {
                if (err) {
                    return console.error("Erro ao executar a qry de UPDATE", err);
                } else {
                    res.setHeader("id", id);
                    res.status(202).json({ "id": id });
                    console.log(result);
                }
            }
        );
    } catch (erro) {
        console.error(erro);
    }
});

//parte dos pedidos

app.get("/pedidos", (req, res) => {
    try {
        client.query("SELECT * FROM pedidos", function
            (err, result) {
            if (err) {
                return console.error("Erro ao executar a qry de SELECT", err);
            }
            res.send(result.rows);
            console.log("Chamou get pedidos");
        });
    } catch (error) {
        console.log(error);
    }
});

app.get("/pedidos/:id", (req, res) => {
    try {
        console.log("Chamou /:id " + req.params.id);
        client.query(
            "SELECT * FROM pedidos WHERE id = $1",
            [req.params.id],
            function (err, result) {
                if (err) {
                    return console.error("Erro ao executar a qry de SELECT id", err);
                }
                if (result.rows.length == 0) {
                    res.send("O pedido com o código: " + req.params.id + "não existe no banco de dados.")
                }
                else {
                    res.send(result.rows);
                    //console.log(result);
                }
            }
        );
    } catch (error) {
        console.log(error);
    }
});

app.post("/pedidos", (req, res) => {
    try {
        console.log("Alguém enviou um post com os dados:", req.body);
        const { NomeCliente, NomeProduto } = req.body;
        client.query(
            "INSERT INTO pedidos (NomeCliente, NomeProduto) VALUES ($1, $2) RETURNING * ",
            [NomeCliente, NomeProduto],
            function (err, result) {
                if (err) {
                    return console.error("Erro ao executar a qry de INSERT", err);
                }
                const { id } = result.rows[0];
                res.setHeader("id", `${id}`);
                res.status(201).json(result.rows[0]);
                console.log(result);
            }
        );
    } catch (erro) {
        console.error(erro);
    }
});

app.delete("/pedidos/:id", (req, res) => {
    try {
        console.log("Chamou delete /:id " + req.params.id);
        const id = req.params.id;
        client.query(
            "DELETE FROM pedidos WHERE id = $1",
            [id],
            function (err, result) {
                if (err) {
                    return console.error("Erro ao executar a qry de DELETE", err);
                } else {
                    if (result.rowCount == 0) {
                        res.status(404).json({ info: "Registro não encontrado." });
                    } else {
                        res.status(200).json({ info: `Registro excluído. Código: ${id}` });
                    }
                }
                console.log(result);
            }
        );
    } catch (error) {
        console.log(error);
    }
});

app.listen(config.port, () =>
    console.log("Servidor funcionando na porta " + config.port)
);

module.exports = app;