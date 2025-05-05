const Delete = ({ closeDeleteModal, selectedProduct, handleDeleteproduct, table, action }) => {
    console.log("ching",selectedProduct);
    
    return (
        <div
            class="modal  show"
            id="exampleModalCenter"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalCenterTitle"
        >
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header" style={{ display: "flex", justifyContent: "space-between" }}>
                        <h5 class="modal-title" id="exampleModalCenterTitle">
                            {action === "enable" ? ("Enable") : action === "disable" ? ("Disable") : ("Delete")} Option
                        </h5>
                        <button
                            type="button"
                            class="close"
                            data-dismiss="modal"
                            aria-label="Close"
                            onClick={closeDeleteModal}
                        >
                            <span>&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        {selectedProduct ? (
                            <>
                                Do you want to {action === "enable" ? ("enable") : action === "disable" ? ("disable") : ("delete")}{" "}
                                {table === "staff" ?
                                    (
                                        <b>{selectedProduct.fullName}</b>
                                    ) : table === "user" ? (<b>{selectedProduct.fullName}</b>) : table === "stock" ? (<b>{selectedProduct.id}</b>) 
                                    : table === "discount" ? (<><span>code </span><b>{selectedProduct.code}</b></>):
                                        (<span>
                                            <b>{selectedProduct.name}</b>
                                        </span>)}


                            </>
                        ) : (
                            "Please choose someone to delete !!!"
                        )}
                    </div>
                    <div class="modal-footer" >
                        <button
                            type="button"
                            class={`btn ${action === "enable" ? ("btn-success") : action === "disable" ? ("btn-danger") : ("btn-danger")}`}
                            onClick={handleDeleteproduct}
                        >
                            {action === "enable" ? ("Enable") : action === "disable" ? ("Disable") : ("Delete")}
                        </button>
                        <button
                            onClick={closeDeleteModal}
                            type="button"
                            class="btn btn-secondary"
                            data-dismiss="modal"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Delete;
