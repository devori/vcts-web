import axios from 'axios';

export async function getAssetsByBase (market, base) {
    const { data } = await axios.get(`/private/markets/${market}/assets/${base}`);

    return data;
}

export async function getTickersByBase (market, base) {
    const { data } = await axios.get(`/private/markets/${market}/tickers/${base}`);
    data[base] = { bid: 1 };

    return data;
}
