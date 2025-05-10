require "test_helper"

class Api::CompaniesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_companies_index_url
    assert_response :success
  end
end
