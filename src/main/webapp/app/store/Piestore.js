Ext.define('ERecon.store.Piestore', {
	extend : 'Ext.data.Store',
	model : 'ERecon.model.Piemodel',
/*
 * autoLoad : true, proxy : { type : 'ajax', url :
 * 'http://localhost:8080/sampledata/piedata.json', reader : { type : 'json',
 * root : 'result' } }
 */
});