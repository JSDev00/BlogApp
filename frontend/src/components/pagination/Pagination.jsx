import "./pagination.css";

const Pagination = ({pages, currentPage, setCurrentPage}) => {
  // const POST_PER_PAGE = 3;
  const generatedPages = [];
  for(let i = 1; i <= pages; i++) {
    generatedPages.push(i);
}

  return (
    <div className="pagination">
      <button className="page previous"
        onClick={() => setCurrentPage(current => current - 1)}
        disabled={currentPage === 1}
      >
        previous
      </button>
      
      {generatedPages.map(page => (
                <div 
                 onClick={() => setCurrentPage(page)} 
                 key={page} 
                 className={currentPage === page ? "page active" : "page"} 
                >
                    {page}
                </div>
            ))}
       <button 
             className="page next"
             onClick={() => setCurrentPage(current => current + 1)}
             disabled={currentPage === pages}
            >
                Next
            </button>
    </div>
  );
};

export default Pagination;
