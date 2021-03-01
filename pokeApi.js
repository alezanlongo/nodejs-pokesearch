const axios = require("axios");
const sqlite3 = require('sqlite3').verbose();
const ENDPOINT_URL = 'https://pokeapi.co/api/v2/pokemon/'
const db = new sqlite3.Database('./pokeApiRepo.db')

let resApi = [];

/**
 * Search Pokemon from database by passed kwd
 * @param {string} kwd
 * @param {Response} res
 */
module.exports.search = (function (kwd, res) {

    db.serialize(() => {
        db.all("SELECT rowid,* FROM pokemon_list WHERE name MATCH ?", kwd + '*', (err, rows) => {
            if (rows.length > 0) {
                let items = [];
                for (idx in rows) {
                    items.push(getItem(rows[idx].pokemon_id, rows[idx].name, res))
                }
                asyncResponse(items, res)
            } else {
                return res.json({ status: 200, results: [] })
            }
        })
    })
})

/**
 * Retrieve Pokemon by id from pokeApi and create results objects
 * @param {number} id 
 * @param {string} name 
 * @param {Response} res 
 */
async function getItem(id, name, res) {
    try {
        return await axios.get(ENDPOINT_URL + id).then(r => {
            if (r.data.sprites.front_default) {
                return ({ id: id, name: name, image: r.data.sprites.front_default })
            }
        })
    } catch (e) {
        return null;
    }

}
/**
 * Handle promises, retrieve Pokemon list
 * @param {Promise} promises 
 * @param {Response} res 
 */
async function asyncResponse(promises, res) {
    let responseResult = { status: Number, results: [] }
    Promise.all(promises).then(function (pr) {
        for (idx in pr) {
            if (pr[idx] !== undefined) responseResult.results.push(pr[idx])
        }
        responseResult.status = 200;
        console.log(responseResult.results.length)
        return res.json(responseResult)
    });

}

/**
 * Create Pokemon's data repository. Just once
 */
module.exports.createRepo = function () {
    db.serialize(() => {
        db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`, 'pokemon_list', (err, row) => {
            if (err === null && row === undefined) {
                db.run(`CREATE VIRTUAL TABLE IF NOT EXISTS pokemon_list USING fts5(pokemon_id, name)`);
                fetchPokemonList()
            }
        });
    });
    function fetchPokemonList(page = 0) {
        let offset = ((page + 1) - 1) * 100;
        axios.get(ENDPOINT_URL + "?limit=100&offset=" + offset).then(r => {
            var stmt = db.prepare("INSERT INTO pokemon_list(pokemon_id,name)VALUES(?,?)");
            for (i = 0; i < Object.keys(r.data.results).length; i++) {
                console.log(i, r.data.results[i])
                stmt.run(r.data.results[i].url.match(/\/(\d{1,6})\/$/)[1], r.data.results[i].name)
            }
            stmt.finalize();
            if (r.data.count > offset) {
                return fetchPokemonList((page + 1))
            }
            db.close();
            console.log('end')
        })
    }
}