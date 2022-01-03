import getSpikesFromAccelerometer from '../utils/StepCalculator';

it ("Should Show 30 Steps Taken", ()=>{


let steps = [];
let previousHighPoint = 0;
let previousValue = 0;//we process every 20 measurements, and this will be the 20th measurement from the last time we processed    
let previousHighPointTime = 0; //this is the most recent time we had a spike in acceleration, we initialize it to 0 meaning none
let spikes = [];//these are the readings where a local max is reached of acceleration over time, and where the local maximum is at least 400 milliseconds after the previous local maximum
let wasGoingUp = false;//in the last round of data we evaluated, was the last reading higher than the previous (trending up)?

//every 20 readings the StepCalculator is called, below are the sample readings:
const accelerometerReadings = [];
accelerometerReadings.push([{"time":1640879359890,"value":9.86126430098126},{"time":1640879359987,"value":10.174734893438957},{"time":1640879360086,"value":10.585152440853411},{"time":1640879360185,"value":8.457217767673127},{"time":1640879360284,"value":11.161452719219486},{"time":1640879360385,"value":10.966405179448463},{"time":1640879360496,"value":9.972325230693707},{"time":1640879360590,"value":13.823083313091956},{"time":1640879360689,"value":9.34358294180432},{"time":1640879360795,"value":11.534156634373836},{"time":1640879360896,"value":8.010575703589337},{"time":1640879360998,"value":9.59999022556942},{"time":1640879361102,"value":14.720644048209591},{"time":1640879361213,"value":8.679318541905651},{"time":1640879361307,"value":9.341669574539365},{"time":1640879361422,"value":8.460753264838429},{"time":1640879361511,"value":8.505025752390457},{"time":1640879361611,"value":8.224557651599254},{"time":1640879361714,"value":8.275600059556526},{"time":1640879361817,"value":7.771753736139539}]);    
accelerometerReadings.push([{"time":1640879362158,"value":6.874235528090015},{"time":1640879362218,"value":9.527000647720595},{"time":1640879362321,"value":9.583586091038903},{"time":1640879362425,"value":9.673163694079076},{"time":1640879362525,"value":7.57078149770131},{"time":1640879362627,"value":9.788439879123066},{"time":1640879362731,"value":7.997049681846099},{"time":1640879362834,"value":10.98957439555578},{"time":1640879362933,"value":17.407912464613997},{"time":1640879363032,"value":8.131285963153363},{"time":1640879363136,"value":10.252204671728954},{"time":1640879363237,"value":7.1713972600244595},{"time":1640879363339,"value":7.446983166326795},{"time":1640879363440,"value":14.553725702577514},{"time":1640879363544,"value":6.918752817296566},{"time":1640879363644,"value":8.005226888540522},{"time":1640879363746,"value":9.026394048891017},{"time":1640879363846,"value":15.834603477000694},{"time":1640879363951,"value":8.236453291822034},{"time":1640879364050,"value":10.93608391596925}]);
accelerometerReadings.push([{"time":1640879364352,"value":21.313249937932635},{"time":1640879364455,"value":6.8564788607717775},{"time":1640879364559,"value":9.29826089922371},{"time":1640879364660,"value":8.285907874940616},{"time":1640879364764,"value":14.2491774800881},{"time":1640879364865,"value":8.23626712350802},{"time":1640879364967,"value":10.34246203893542},{"time":1640879365069,"value":6.66572873112516},{"time":1640879365174,"value":9.838417229782323},{"time":1640879365275,"value":21.73656644877249},{"time":1640879365378,"value":6.2506599225440285},{"time":1640879365480,"value":9.93639003985326},{"time":1640879365582,"value":7.763828148909963},{"time":1640879365683,"value":12.363111227502788},{"time":1640879365783,"value":11.955438958871161},{"time":1640879365887,"value":11.133532700116977},{"time":1640879365988,"value":8.82674790744644},{"time":1640879366089,"value":9.324954419687472},{"time":1640879366192,"value":14.73331781047275},{"time":1640879366293,"value":7.493768598054334}]);
accelerometerReadings.push([{"time":1640879366629,"value":10.655408304740103},{"time":1640879366695,"value":16.129156613714535},{"time":1640879366797,"value":7.39131516877229},{"time":1640879366899,"value":9.69707634198457},{"time":1640879366999,"value":8.265562898491757},{"time":1640879367102,"value":6.332234233823211},{"time":1640879367203,"value":16.122375483101706},{"time":1640879367306,"value":6.941091546162468},{"time":1640879367415,"value":9.685141862417868},{"time":1640879367512,"value":9.445420954941177},{"time":1640879367615,"value":14.366924761662776},{"time":1640879367714,"value":8.968626573001005},{"time":1640879367820,"value":10.293932098523836},{"time":1640879367918,"value":7.746839455266316},{"time":1640879368023,"value":10.932466481015},{"time":1640879368125,"value":18.15795085183807},{"time":1640879368234,"value":5.004794947860559},{"time":1640879368329,"value":11.036636267062537},{"time":1640879368435,"value":9.65898150728468},{"time":1640879368531,"value":12.833048004137858}]);
accelerometerReadings.push([{"time":1640879368871,"value":9.236323187219917},{"time":1640879368938,"value":9.831138854214677},{"time":1640879369041,"value":19.062921045415692},{"time":1640879369143,"value":7.7927651514152245},{"time":1640879369245,"value":8.99649314553336},{"time":1640879369349,"value":10.232503728147693},{"time":1640879369449,"value":10.126661988346388},{"time":1640879369553,"value":14.502456863486367},{"time":1640879369655,"value":8.284663983268402},{"time":1640879369756,"value":9.970417774786418},{"time":1640879369856,"value":8.174281909644845},{"time":1640879369958,"value":9.841571468127212},{"time":1640879370068,"value":15.964135414498262},{"time":1640879370162,"value":8.987924379606676},{"time":1640879370265,"value":8.39830582892281},{"time":1640879370366,"value":10.273156497680713},{"time":1640879370470,"value":11.027853113239978},{"time":1640879370572,"value":7.826728822933386},{"time":1640879370674,"value":11.133898582213112},{"time":1640879370774,"value":6.787293847377158}]);
accelerometerReadings.push([{"time":1640879371107,"value":10.474786794560833},{"time":1640879371183,"value":8.108114599551099},{"time":1640879371285,"value":9.320642923373509},{"time":1640879371387,"value":13.648807761264997},{"time":1640879371488,"value":8.507651610598947},{"time":1640879371588,"value":11.020632610404565},{"time":1640879371691,"value":6.893234830327878},{"time":1640879371795,"value":9.751824287183679},{"time":1640879371895,"value":21.211671691155622},{"time":1640879371998,"value":8.49355969536737},{"time":1640879372101,"value":7.218663777681634},{"time":1640879372200,"value":8.2884902267247},{"time":1640879372305,"value":13.58910163546844},{"time":1640879372405,"value":10.656190637747278},{"time":1640879372507,"value":10.933822362933071},{"time":1640879372610,"value":6.2564101499647435},{"time":1640879372713,"value":9.957365156659174},{"time":1640879372817,"value":19.670802086642382},{"time":1640879372918,"value":6.627811097841035},{"time":1640879373021,"value":8.93331923430996}]);
accelerometerReadings.push([{"time":1640879373358,"value":10.82939879713389},{"time":1640879373422,"value":9.67688098145433},{"time":1640879373526,"value":7.204501409596731},{"time":1640879373626,"value":8.212470271506843},{"time":1640879373727,"value":18.423727406934226},{"time":1640879373830,"value":7.718509943853104},{"time":1640879373932,"value":7.7522649128758205},{"time":1640879374034,"value":7.097355097893354},{"time":1640879374136,"value":14.543029035919421},{"time":1640879374237,"value":10.446939567396441},{"time":1640879374338,"value":10.277860033535704},{"time":1640879374442,"value":7.331118171533725},{"time":1640879374544,"value":8.653908413368775},{"time":1640879374645,"value":18.73422676956423},{"time":1640879374748,"value":6.899785470601207},{"time":1640879374847,"value":10.607907040408325},{"time":1640879374949,"value":6.054039738210801},{"time":1640879375052,"value":9.49167596483316},{"time":1640879375151,"value":18.04171854700636},{"time":1640879375253,"value":10.211371004055541}]);
accelerometerReadings.push([{"time":1640879375581,"value":9.071044777368705},{"time":1640879375661,"value":16.88008570241664},{"time":1640879375765,"value":9.78726094029316},{"time":1640879375865,"value":7.775052099228527},{"time":1640879375969,"value":8.209571351583518},{"time":1640879376071,"value":15.69097723787398},{"time":1640879376172,"value":10.760045896858843},{"time":1640879376275,"value":8.602526596948898},{"time":1640879376375,"value":7.409171393358387},{"time":1640879376477,"value":8.911913812957444},{"time":1640879376578,"value":15.756383534716534},{"time":1640879376680,"value":9.713449068420035},{"time":1640879376791,"value":8.334014634491007},{"time":1640879376882,"value":6.594030015900177},{"time":1640879376987,"value":12.646091359376065},{"time":1640879377086,"value":20.21615267680708},{"time":1640879377189,"value":9.185974745683833},{"time":1640879377288,"value":7.399556003388542},{"time":1640879377390,"value":6.581914168708099},{"time":1640879377494,"value":9.731705101294802}]);
accelerometerReadings.push([{"time":1640879377828,"value":8.082298762479674},{"time":1640879377900,"value":9.102028546762803},{"time":1640879378002,"value":10.632876417743848},{"time":1640879378106,"value":14.053908541551985},{"time":1640879378207,"value":7.377473636757312},{"time":1640879378308,"value":8.9986369703869},{"time":1640879378409,"value":7.630346880009514},{"time":1640879378511,"value":8.644522702557476},{"time":1640879378622,"value":12.903209684163802},{"time":1640879378717,"value":9.512321985395255},{"time":1640879378820,"value":7.090407665109722},{"time":1640879378921,"value":8.296647770105121},{"time":1640879379023,"value":17.917073833983252},{"time":1640879379123,"value":8.66126548249701},{"time":1640879379225,"value":10.826517968091693},{"time":1640879379331,"value":4.972239124138462},{"time":1640879379431,"value":8.863206083454603},{"time":1640879379530,"value":19.422187341683703},{"time":1640879379635,"value":7.11373228788544},{"time":1640879379737,"value":7.568910737381592}]);
accelerometerReadings.push([{"time":1640879380072,"value":10.037695693192996},{"time":1640879380142,"value":11.15461766959585},{"time":1640879380246,"value":6.850906828142586},{"time":1640879380349,"value":9.136735195850157},{"time":1640879380450,"value":15.036836727534038},{"time":1640879380553,"value":8.47484810835985},{"time":1640879380654,"value":9.619595086445505},{"time":1640879380756,"value":6.829539947069555},{"time":1640879380856,"value":11.016778352200797},{"time":1640879380958,"value":16.544378599219137},{"time":1640879381062,"value":10.450929092928074},{"time":1640879381164,"value":8.239186505891404},{"time":1640879381266,"value":7.077896897775186},{"time":1640879381368,"value":13.562870175996066},{"time":1640879381470,"value":9.391875872104928},{"time":1640879381572,"value":9.401183439478716},{"time":1640879381671,"value":6.622045908832639},{"time":1640879381773,"value":10.638632554136052},{"time":1640879381878,"value":19.447810077688864},{"time":1640879381976,"value":10.095508256327705}]);
accelerometerReadings.push([{"time":1640879382302,"value":11.273827355551202},{"time":1640879382384,"value":10.178480358009054},{"time":1640879382487,"value":5.622214950554534},{"time":1640879382591,"value":10.098589043576865},{"time":1640879382693,"value":8.393315534726039},{"time":1640879382793,"value":14.345063040010459},{"time":1640879382897,"value":14.778301126668259},{"time":1640879382998,"value":11.459149814588983},{"time":1640879383099,"value":7.062346449662282},{"time":1640879383199,"value":8.085247305852791},{"time":1640879383299,"value":19.92892323949551},{"time":1640879383400,"value":6.132075229634193},{"time":1640879383502,"value":10.916401109976016},{"time":1640879383604,"value":8.417964285975685},{"time":1640879383706,"value":9.065465580004933},{"time":1640879383808,"value":20.237999649286966},{"time":1640879383910,"value":11.219740953174872},{"time":1640879384016,"value":7.392724922946856},{"time":1640879384121,"value":7.374596349702749},{"time":1640879384214,"value":20.052263642340336}]);
accelerometerReadings.push([{"time":1640879384520,"value":8.206196703530141},{"time":1640879384626,"value":11.759378666682336},{"time":1640879384726,"value":13.39458046951026},{"time":1640879384828,"value":9.475724625408},{"time":1640879384952,"value":8.664490789573174},{"time":1640879385078,"value":7.846834474012751},{"time":1640879385132,"value":19.468973340751702},{"time":1640879385234,"value":7.484359722418233},{"time":1640879385339,"value":6.899842099039434},{"time":1640879385439,"value":8.181601790969104},{"time":1640879385545,"value":11.36679264892477},{"time":1640879385641,"value":17.722442804712706},{"time":1640879385744,"value":11.702728481074562},{"time":1640879385845,"value":7.95935598966294},{"time":1640879385948,"value":4.742395010791534},{"time":1640879386053,"value":5.767891370834342},{"time":1640879386154,"value":14.21917382629304},{"time":1640879386257,"value":5.790338700483993},{"time":1640879386360,"value":10.462572210822001},{"time":1640879386461,"value":8.105237980356303}]);
accelerometerReadings.push([{"time":1640879386786,"value":10.415883736613234},{"time":1640879386866,"value":7.405597481325926},{"time":1640879386968,"value":6.295716219924954},{"time":1640879387070,"value":10.194632134421965},{"time":1640879387172,"value":13.90074791676458},{"time":1640879387274,"value":6.294564156695985},{"time":1640879387379,"value":10.697262205306167},{"time":1640879387479,"value":7.2351284609574416},{"time":1640879387584,"value":13.744753762511671},{"time":1640879387685,"value":14.736615805922618},{"time":1640879387786,"value":10.204022142932764},{"time":1640879387890,"value":9.34579406077321},{"time":1640879387988,"value":6.793155687761767},{"time":1640879388091,"value":9.068847857876225},{"time":1640879388194,"value":19.858337199906178},{"time":1640879388295,"value":4.978078022688308},{"time":1640879388395,"value":12.654244455499068},{"time":1640879388500,"value":8.077650855119295},{"time":1640879388602,"value":10.210793429401551},{"time":1640879388701,"value":7.942571934006269}]);
accelerometerReadings.push([{"time":1640879389021,"value":9.160953650124068},{"time":1640879389108,"value":9.26540899885626},{"time":1640879389211,"value":9.962745254705048},{"time":1640879389313,"value":9.982748032296714},{"time":1640879389415,"value":10.07010064273405},{"time":1640879389517,"value":9.8773881627922},{"time":1640879389622,"value":10.092557326242922},{"time":1640879389725,"value":10.013761404794637},{"time":1640879389824,"value":9.648155836094764},{"time":1640879389924,"value":9.90564111177008},{"time":1640879390027,"value":10.038585052230255},{"time":1640879390126,"value":9.995812650277408},{"time":1640879390228,"value":9.905559997603225},{"time":1640879390331,"value":9.09840999501093},{"time":1640879390434,"value":9.227418616383767},{"time":1640879390535,"value":9.837178713168235},{"time":1640879390637,"value":9.83680446154118},{"time":1640879390740,"value":10.07548339355267},{"time":1640879390841,"value":10.065512195553742},{"time":1640879390943,"value":9.649957452354014}]);

accelerometerReadings.forEach((accelerometerReading)=>{
    console.log(accelerometerReading.time+","+accelerometerReading.value);
})
// accelerometerReadings.forEach((recentAccelerationData)=>{
//     console.log("New Previous Value from calling program: "+previousValue);
//     ({spikes, previousHighPointTime, wasGoingUp} = getSpikesFromAccelerometer({recentAccelerationData, threshold:11, previousValue, previousHighPointTime, wasGoingUp}));
//     previousValue = recentAccelerationData[recentAccelerationData.length-1].value;
//     console.log("New Previous High Point Time from calling program: "+previousHighPointTime);
//     steps = steps.concat(spikes);
//     console.log("Steps: "+steps.length);
    
// });


// expect(steps.length).toBe(60);//this is because for each step we step forward and then back, so 30 steps should be 60


});