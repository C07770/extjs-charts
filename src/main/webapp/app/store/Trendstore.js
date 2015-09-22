Ext.define('ERecon.store.Trendstore', {
	extend : 'Ext.data.Store',
	model : 'ERecon.model.Trendmodel',

/*
 * autoLoad : false, proxy : { type : 'ajax', url :
 * 'http://localhost:8080/sampledata/trenddata.json', reader : { type : 'json',
 * root : 'result' } }
 */
});