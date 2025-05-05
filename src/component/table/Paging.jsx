const Paging = ({ handlePage, totalPages, selectedPage }) => {
    const handlePrevious = () => {
        return (selectedPage == 0) ? handlePage(totalPages - 1) :
            handlePage(selectedPage - 1);
    }

    const handleNext = () => {
        return (selectedPage == totalPages - 1) ? handlePage(0) :
            handlePage(selectedPage + 1);
    }
    return (
        <div class="clearfix">
            <div class="hint-text">Showing <b>5</b> out of <b>25</b> entries</div>
            <ul class="pagination">
                <li class="page-item disabled" onClick={() => handlePrevious()}><a href="#">Previous</a></li>
                {totalPages > 0 && Array.from({ length: totalPages }).map((_, index) => {
                    return (<li class={`page-item ${(selectedPage === index) ? "active" : ""}`} key={index + 1} onClick={() => handlePage(index)}>
                        <a href="#" class="page-link">{index + 1}</a>
                    </li>)

                })}
                <li class="page-item"><a href="#" class="page-link" onClick={() => handleNext()}>Next</a></li>
            </ul>
        </div>
    );
}

export default Paging;