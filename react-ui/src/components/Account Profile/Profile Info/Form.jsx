import Input from "./Input";

const Form = () => (
  <div class="row">
    <Input id="account-fn" name="First Name" type="text" value="Amanda" />
    <Input id="account-in" name="Last Name" type="text" value="Wilson" />
    <Input id="account-email" name="Email address" type="text" value="a.wilson@example.com" />
    <Input id="account-username" name="Username" type="text" value="amanda_w" />
    <div class="col-sm-6">
      <div class="mb-3 pb-1">
        <label class="form-label px-0" for="account-country">Country</label>
        <select class="form-select" id="account-country" defaultValue="Select Country">
          <option defaultValue="Select Country">Select Country</option>
          <option defaultValue="Argentina">Argentina</option>
          <option defaultValue="Belgium">Belgium</option>
          <option defaultValue="France">France</option>
          <option defaultValue="Germany">Germany</option>
          <option defaultValue="Madagascar">Madagascar</option>
          <option defaultValue="Spain">Spain</option>
          <option defaultValue="UK">United Kingdom</option>
          <option defaultValue="USA">USA</option>
        </select>
      </div>
    </div>
    <Input id="account-city" name="City" type="text" value="New York" />
    <Input id="account-address" name="Address Line" type="text" value="Some Cool Street, 22/1" />
    <Input id="account-zip" name="ZIP Code" type="text" value="" />
    <div class="col-12">
      <hr class="mt-2 mb-4" />
      <div class="d-flex flex-wrap justify-content-between align-items-center">
        <div class="form-check d-block">
          <input class="form-check-input" type="checkbox" id="show-email" defaultChecked />
          <label class="form-check-label" for="show-email">Show my email to registered users</label>
        </div>
        <button class="btn btn-primary mt-3 mt-sm-0" type="button">
          <i class="ai-save fs-lg me-2"></i>Save changes
        </button>
      </div>
    </div>
  </div>
);

export default Form
