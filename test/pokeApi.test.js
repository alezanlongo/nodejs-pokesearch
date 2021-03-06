//import Mocha from 'Mocha';
let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
chai.use(chaiHttp);
const url = 'http://localhost:8080';

describe('Search on local api: ', () => {
    it('should get sever results', (done) => {
        chai.request(url)
            .post('/search')
            .send({ kwd: "pikachu" })
            .end(function (err, res) {
                expect(res.body.results.length).is.eq(15)
                expect(res).to.have.status(200);
                done();
            });
    });
});

