require "test_helper"

class Api::RolesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_roles_index_url
    assert_response :success
  end
end
