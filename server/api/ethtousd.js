const db = require('../models/index.js');
var util = require('util');
const { DateTime } = require('luxon');
const axios = require('axios');

global.one_eth_in_usd = 0;
global.one_eth_in_usd_last_updated_at = null;
var max_age_of_quote = 10000; //milliseconds

exports.ethtousd = async function(req, res){
    console.log('/api/ethtousd called');
    var num_eth = 1;
    if (req.query.eth && req.query.eth > 0){
        num_eth = req.query.eth;
    }
    var usd = await getEthInUSD(num_eth);
    var ret = {usd: usd, eth: num_eth};
    console.log("/api/ethtousd returning: "+JSON.stringify(ret));

    res.set('Content-Type', 'application/json');
    return res.send(ret)
};

var getEthInUSD = exports.getEthInUSD = async function(eth){
    var result = global.one_eth_in_usd;
    if (!global.one_eth_in_usd_last_updated_at || DateTime.now().diff(global.one_eth_in_usd_last_updated_at).milliseconds > max_age_of_quote){
        global.one_eth_in_usd_last_updated_at = DateTime.now(); 
        result = await updateEthInUSD();
    } else {
        console.log("using cached conversion rate");
    }
    if (eth && eth > 0){
        result = global.one_eth_in_usd * eth;
    }
    return result;
};

var updateEthInUSD = updateEthInUSD = async function(){
    console.log("making etherscan API call to update ETH price");

    try{
        let response = await axios.get('https://api.etherscan.io/api?module=stats&action=ethprice&apikey=YourApiKeyToken');

        var data = response.data;
        console.log(JSON.stringify(data));

        if (response?.data?.result?.ethusd){
            global.one_eth_in_usd = response.data.result.ethusd;
        } else {
            console.error("ethusd NOT FOUND in API call to etherscan, they may have changed their format");
        }
        
    } catch (error){
        console.error(error);
    }
}

