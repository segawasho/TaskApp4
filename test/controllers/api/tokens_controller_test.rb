require "test_helper"

class Api::TokensControllerTest < ActionDispatch::IntegrationTest
  test "should get refresh" do
    get api_tokens_refresh_url
    assert_response :success
  end
end
