var local_config = {
	// Here you can override any configuration field that is specifig to a local machine.
	// The config.local.js is git ignored.

	host_url: 'http://mj.cis.fiu.edu/oauthd',
	//host_url: 'http://mj.cis.fiu.edu',
	//base: '/oauthd',
	//base_api: '/oauthd/api',
	bind: '127.0.0.1',
	port: 6284
};

module.exports = local_config;
