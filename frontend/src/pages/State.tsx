function State() {
  return (
    <div className="container">
      <h2>Manage State</h2>
      <form>
        <div className="row mb-3">
            <div className="col">
                <input type="text" placeholder="Enter Country" className="form-control" />
            </div>
            <div className="col">
                <input type="text" placeholder="Enter State" className="form-control" />
            </div>
        </div>
        <div className="row mb-3 text-center">
          <div className="col">
            <button className="btn btn-primary">Add State</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default State
