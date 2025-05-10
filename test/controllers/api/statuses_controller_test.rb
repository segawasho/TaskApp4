require "test_helper"

class Api::StatusesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_statuses_index_url
    assert_response :success
  end
end
