const { describe, it } = require("mocha")

//Require the dev-dependencies
const chai = require("chai")
const chaiHttp = require("chai-http")

const server = require('../../../src/server')
const expect = chai.expect
const uri = "/api/v1"
chai.use(chaiHttp)

describe('Contract service', () => {
    it('It should return the contract only if it belongs to the profile calling', () => {
        return new Promise((done, reject) => {
            chai
                .request(server.app)
                .get(uri + '/contracts/1')
                .set('Content-Type', 'application/json')
                .set('Cookie', 'profile_id=1; Path=/; Expires=Tue, 27 Aug 2024 21:08:42 GMT;')
                .send()
                .end((err, res) => {
                    expect(res).to.have.status(200)

                    const jsonRes = JSON.parse(res.text.trim());
                    if (err !== null) {
                        reject(err)
                    }
                    expect(jsonRes?.id).to.be.equal(1)
                    expect(jsonRes?.status).to.be.equal('terminated')
                    expect(jsonRes?.ContractorId).to.be.equal(5)
                    expect(jsonRes?.ClientId).to.be.equal(1)
                    done()
                })
        })
    })

    it('Returns a list of contracts belonging to a user (client or contractor), the list should only contain non terminated contracts.', () => {
        return new Promise((done, reject) => {
            chai
            .request(server.app)
            .get(uri + '/contracts')
            .set('Content-Type', 'application/json')
            .set('Cookie', 'profile_id=1; Path=/; Expires=Tue, 27 Aug 2024 21:08:42 GMT;')
            .send()
            .end((err, res) => {
                expect(res).to.have.status(200)

                const jsonRes = JSON.parse(res.text.trim());
                if (err !== null) {
                    reject(err)
                }
                expect(jsonRes[0]?.id).to.be.equal(1)
                expect(jsonRes[0]?.status).to.be.equal('terminated')
                expect(jsonRes[0]?.ContractorId).to.be.equal(5)
                expect(jsonRes[0]?.ClientId).to.be.equal(1)
                done()
            })
        })
    })
})
