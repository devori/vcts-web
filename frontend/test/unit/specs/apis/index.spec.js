import axios from 'axios';
import sinon from 'sinon';
import { expect } from 'chai';

import { getAssetsByBase, getTickersByBase } from '../../../../src/apis';

describe('apis/index.js', () => {
    beforeEach(() => {
        sinon.stub(axios, 'get').resolves({ data: { a: 'test-data' } });
    });

    afterEach(() => {
        axios.get.restore();
    });

    describe('getAssetsByBase', () => {
        it('should return data when url is correct', async () => {
            const result = await getAssetsByBase('test-market', 'test-base');

            expect(axios.get.calledWith('/private/markets/test-market/assets/test-base')).to.be.true;
            expect(result).to.deep.equal({ a: 'test-data' });
        });
    });

    describe('getTickersByBase', () => {
        it('should return data with base bid when url is correct', async () => {
            const result = await getTickersByBase('test-market', 'test-base');

            expect(axios.get.calledWith('/private/markets/test-market/tickers/test-base')).to.be.true;
            expect(result).to.deep.equal({ a: 'test-data', 'test-base': { bid: 1 } });
        });
    });
});
