const test = require('node:test');
const assert = require('node:assert/strict');
const { RoutingManager } = require('../app/routing');
function make(clients) {
 const r=new RoutingManager({inboundInterfaces:['awg3'],downstreamNetworks:['10.8.3.0/24'],downstreamAddresses:()=>[],clientRoutes:()=>clients,mtu:1280,dnsUpstream:'1.1.1.1'});
 r.state={defaultRoute:{type:'direct'},upstreams:{b:{id:'b',slot:0,enabled:true},c:{id:'c',slot:1,enabled:false}},policies:{}};return r;
}
test('pinned source routes precede marks and all destination policies; DNS is DNAT before proxy redirect',()=>{
 const r=make([{address:'10.8.3.2',enabled:true,egress:'upstream',upstreamId:'b'}]);const s=r.nftScript();
 assert.ok(s.includes('set client_upstream_0 { type ipv4_addr; elements = { 10.8.3.2 }; }'));
 assert.ok(s.indexOf('ip saddr @client_upstream_0 meta mark set 0x201')<s.indexOf('ct mark != 0 return'));
 assert.ok(s.indexOf('udp dport 53 dnat ip to 1.1.1.1:53')<s.indexOf('udp dport 53 redirect to :53'));
 assert.ok(s.includes('tcp dport 53 dnat ip to 1.1.1.1:53'));
});
test('missing pinned tunnel fails closed; disabled tunnel keeps pin; inactive clients omitted',()=>{
 const sets=make([{address:'10.8.3.2',egress:'upstream',upstreamId:'missing'},{address:'10.8.3.3',egress:'upstream',upstreamId:'c'},{address:'10.8.3.4',egress:'upstream',upstreamId:'b',enabled:false}]).clientSourceSets();
 assert.deepEqual(sets.blocked_clients_v4,['10.8.3.2']);assert.deepEqual(sets.client_upstream_1,['10.8.3.3']);assert.deepEqual(sets.client_upstream_0,[]);
});
test('mode validation and atomic cleanup prevent reused addresses inheriting pins',async()=>{
 const clients=[{address:'10.8.3.2',egress:'upstream',upstreamId:'b'}];const r=make(clients);assert.throws(()=>r.validateClientEgress({egress:'upstream',upstreamId:'missing'}));
 assert.deepEqual(r.validateClientEgress({egress:'direct',upstreamId:'b'}),{egress:'direct',upstreamId:null});
 let s;r.applyNftScript=x=>(s=x,{status:0});await r.syncDirectClients();assert.ok(s.includes('add element inet awg_chain_easy client_upstream_0 { 10.8.3.2 }'));
 clients[0].egress='default';await r.syncDirectClients();assert.ok(!s.includes('add element'));
});
