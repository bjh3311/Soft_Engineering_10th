$(function () {
    window.pagObj = $('#pagination').twbsPagination({
        totalPages: 35,
        visiblePages: 10,
        onPageClick: function (event, page) {
            console.log(page + ' (from options)');
        }
    }).on('page', function (event, page) {
        console.log(page + ' (from event listening)');
    });
});
