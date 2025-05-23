require "test_helper"

class Api::IndustriesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_industries_index_url
    assert_response :success
  end
end
