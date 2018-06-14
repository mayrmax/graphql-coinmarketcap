const fetch = require('node-fetch')

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
} = require('graphql')

const TickerType = new GraphQLObjectType({
  name: 'Ticker',
  description: 'a ticker',
  fields: {
    id: {
      type: GraphQLInt,
      resolve: json => json.id,
    },
    name: {
      type: GraphQLString,
      resolve: json => json.name,
    },
    symbol: {
      type: GraphQLString,
      resolve: json => json.symbol,
    },
    rank: {
      type: GraphQLInt,
      resolve: json => json.rank,
    },
    priceUSD: {
      type: GraphQLFloat,
      resolve: json => json.quotes.USD.price,
    },
    priceBTC: {
      type: GraphQLFloat,
      resolve: json => json.quotes.USD.price,
    },
    dailyVolumeUSD: {
      type: GraphQLFloat,
      resolve: json => json.quotes.USD.volume_24h,
    },
    marketCapUSD: {
      type: GraphQLFloat,
      resolve: json => json.quotes.USD.market_cap,
    },
    circulatingSupply: {
      type: GraphQLFloat,
      resolve: json => json.circulating_supply,
    },
    totalSupply: {
      type: GraphQLFloat,
      resolve: json => json.total_supply,
    },
    percentChange1h: {
      type: GraphQLFloat,
      resolve: json => json.quotes.USD.percent_change_1h,
    },
    percentChange24h: {
      type: GraphQLFloat,
      resolve: json => json.quotes.USD.percent_change_24h,
    },
    percentChange7d: {
      type: GraphQLFloat,
      resolve: json => json.quotes.USD.percent_change_7d,
    },
    lastUpdated: {
      type: GraphQLInt,
      resolve: json => json.last_updated,
    },
  },
})

const GlobalType = new GraphQLObjectType({
  name: 'Global',
  description: 'Global data about markets',
  fields: {
    totalMarketCapUSD: {
      type: GraphQLFloat,
      resolve: json => json.quotes.USD.total_market_cap,
    },
    total24hVolumeUSD: {
      type: GraphQLFloat,
      resolve: json => json.quotes.USD.total_volume_24h,
    },
    bitcoinPercentageOfMarketCap: {
      type: GraphQLFloat,
      resolve: json => json.bitcoin_percentage_of_market_cap,
    },
    activeCryptocurrencies: {
      type: GraphQLInt,
      resolve: json => json.active_cryptocurrencies,
    },
    activeMarkets: {
      type: GraphQLInt,
      resolve: json => json.active_markets,
    },
    lastUpdated: {
      type: GraphQLInt,
      resolve: json => json.last_updated
    }
  },
})

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    description: 'get a list of tickers',
    fields: {
      tickers: {
        type: new GraphQLList(TickerType),
        args: {
          limit: { type: GraphQLInt },
          start: { type: GraphQLInt },
        },
        resolve: (root, args) => fetch(
          `https://api.coinmarketcap.com/v2/ticker/?limit=${args.limit || 100}&start=${args.start || 0}`,
        )
          .then(response => response.json().then((res) => Object.keys(res.data).map((key) => res.data[key]))),
      },
      ticker: {
        type: TickerType,
        args: {
          id: { type: GraphQLInt },
        },
        resolve: (root, args) => fetch(
          `https://api.coinmarketcap.com/v2/ticker/${args.id}/?convert=BTC`,
        )
          .then(response => response.json().then((res) => res.data)),
      },
      global: {
        type: GlobalType,
        resolve: () => fetch(`https://api.coinmarketcap.com/v2/global/?convert=BTC`)
          .then(response => response.json().then((res) => res.data)),
      },
    },
  }),
})

module.exports = schema