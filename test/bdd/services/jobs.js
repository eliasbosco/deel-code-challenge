const { describe, it } = require("mocha")

//Require the dev-dependencies
const chai = require("chai")
const chaiHttp = require("chai-http")

const server = require('../../../src/server')
const expect = chai.expect
const uri = "/api/v1"
chai.use(chaiHttp)

describe('Jobs service', () => {
    it('Get all unpaid jobs for a user (either a client or contractor), for active contracts only', () => {
        return new Promise((done, reject) => {
            chai
                .request(server.app)
                .get(uri + '/jobs/unpaid')
                .set('Content-Type', 'application/json')
                .set('Cookie', 'profile_id=2; Path=/; Expires=Tue, 27 Aug 2024 21:08:42 GMT;')
                .send()
                .end((err, res) => {
                    expect(res).to.have.status(200)

                    const jsonRes = JSON.parse(res.text.trim());
                    if (err !== null) {
                        reject(err)
                    }
                    expect(jsonRes[0]?.id).to.be.equal(3)
                    expect(jsonRes[0]?.description).to.be.equal('work')
                    expect(jsonRes[0]?.price).to.be.equal(202)
                    expect(jsonRes[0]?.ContractId).to.be.equal(3)
                    expect(jsonRes[0]?.Contract?.id).to.be.equal(3)
                    expect(jsonRes[0]?.Contract?.status).to.be.equal('in_progress')
                    expect(jsonRes[0]?.Contract?.ClientId).to.be.equal(2)
                    expect(jsonRes[0]?.Contract?.ContractorId).to.be.equal(6)
                    done()
                })
        })
    })
})
