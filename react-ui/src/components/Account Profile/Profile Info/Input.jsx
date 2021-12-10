const Input = ({ id, name, type, value }) => (
  <div class="col-sm-6">
    <div class="mb-3 pb-1">
      <label class="form-label px-0" for={id}>{name}</label>
      {
      id === 'account-username' 
      ?
        (
          <div class="input-group">
            <span class="input-group-text">@</span>
            <input class="form-control" type="text" id="account-username" defaultValue="amanda_w" />
          </div>
        )
      :
        <input class="form-control" type={type} id={id} defaultValue={value} />
      }
    </div>
  </div>
);

export default Input;
