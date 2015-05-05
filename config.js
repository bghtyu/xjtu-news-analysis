/**
 * Created by walter on 15-4-1.
 */

//exports.update = true;
exports.update = false;

exports.url = {
    hostName: 'http://jwc.xjtu.edu.cn',
    currentPage: '/html/tzgg/1.html',
    update: exports.update
};

exports.requestOptions = {
    method: 'GET',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.89 Safari/537.36',
        'Accept-Language': 'zh-CN,zh;q=0.8'
    }
};

exports.url_jwc = {
    hostName: 'http://jwc.xjtu.edu.cn',
    listPage: '/html/tzgg/1.html'
};

exports.url_eieug = {
    hostName: 'http://eieug.xjtu.edu.cn',
    listPage: '/index.php/Tongzhigonggao/index/p/1',
    urlReg: /(\/index\.php\/Tongzhigonggao\/index\/p\/)(\d+)/
};

exports.url_gjc = {
    hostName: 'http://202.117.3.94/gjc/',
    listPage: 'tongzhigonggao/index.jsp?pageNumber=1'
};

exports.url_cy = {
    hostName: 'http://cy.xjtu.edu.cn',
    listPage: 'list.php?catid=47&page=1',
    urlReg: /(list\.php\?catid=47&page=)(\d+)/
};
