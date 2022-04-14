



export const ethPriceInUSD = async () => {
    //Get current ETH->USD price
  try{
    //Call back to server to get latest quote
    var response = await fetch(process.env.REACT_APP_NODE_URI + '/api/ethtousd', {
        method: 'GET',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
            //Authorization: `Bearer ${userContext.token}`
        }
    })

    if (response && response.status >= 200 && response.status < 300) {
      var json = await response.json()
      console.log("/api/ethtousd returned json.usd="+json.usd);
      return json.usd;    
    } else {
      console.log("/api/ethtousd api error");
    }
  } catch (error){
    console.error(error);
    return 0;
  }
    
};


        




