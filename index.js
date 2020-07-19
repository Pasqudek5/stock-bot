const WOOD_STOCK = 'premium_exchange_stock_wood'
const STONE_STOCK = 'premium_exchange_stock_stone'
const IRON_STOCK = 'premium_exchange_stock_iron'

const BUY_WOOD = 'buy_wood'
const BUY_STONE = 'buy_stone'
const BUY_IRON = 'buy_iron'

const SELL_WOOD = 'sell_wood'
const SELL_STONE = 'sell_stone'
const SELL_IRON = 'sell_iron'

const PREMIUM_POINTS = 'premium_points'

const getPremiumPoints = () => parseInt(document.getElementById(PREMIUM_POINTS).innerText)

const greaterThan = (stock, min) => stock > min

const getHash = state => {

  const data = {
    [BUY_WOOD]: 0,
    [BUY_STONE]: 0,
    [BUY_IRON]: 0,
    [SELL_WOOD]: 0,
    [SELL_STONE]: 0,
    [SELL_IRON]: 0,
    ...state,
  }

  const meta = ['market', { ajaxaction: 'exchange_begin' }, data]

  window.TribalWars.post(...meta, ([{ resource, amount, rate_hash }]) => {
    buy(resource, amount, rate_hash)
  })
}

const buy = (resource, amount, rate_hash) => {
  const rate = `rate_${resource}`
  const buy = `buy_${resource}`

  const data = {
    [buy]: amount,
    mb: 1,
    [rate]: rate_hash
  }

  const meta = ['market', { ajaxaction: 'exchange_confirm' }, data]

  window.TribalWars.post(...meta, () => {
    console.log(`bought: ${resource} - ${amount}`)
  })
}


const run = () => {
  const minInStock = parseInt(prompt('od ilu kupowac?'))
  const minPremiumPoints = parseInt(prompt('do ilu pp ma kupowac: '))

  if (!confirm('Włączyć?')) {
    return
  }

  console.log('RUN!')

  const state = {}

  const elements = [
    document.getElementById(WOOD_STOCK),
    document.getElementById(STONE_STOCK),
    document.getElementById(IRON_STOCK)
  ]

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      const stock = parseInt(mutation.target.innerText)
      const material = mutation.target.id.replace('premium_exchange_stock', 'buy')

      state[material] = stock

      if (greaterThan(getPremiumPoints(), minPremiumPoints) && greaterThan(stock, minInStock)) {
        getHash(state)
      }
      state[material] = 0
    })
  })

  const config = { attributes: true, childList: false, characterData: true }

  elements.forEach(target => {
    observer.observe(target, config)
  })
}
run()



/*
// fetch('https://pl155.plemiona.pl/game.php?village=7252&screen=market&mode=transports&ajax=exchange_data').then(r=>r.json()).then(a=>console.log(a))
// */

// javascript: $.get('https://scripts.ibragonza.nl/enhancer/enhancerAlt.js');void(0);
// javascript: $.get('https://dl.dropboxusercontent.com/s/1kfp8ja9k9io86b/Tsalkapone.rally_point_script.js');void(0);