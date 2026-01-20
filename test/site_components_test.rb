require_relative "test_helper"

class SiteComponentsTest < Minitest::Test
  include SiteTestSupport

  def test_config_has_required_keys
    config = load_config
    assert config.key?("title")
    assert config.key?("url")
    assert config.key?("description")
  end

  def test_layout_files_present
    layouts = %w[content.html default.html page.html post.html]
    layouts.each do |layout|
      layout_path = File.join(project_root, "_layouts", layout)
      assert File.exist?(layout_path), "Missing layout: #{layout}"
    end
  end

  def test_include_files_present
    includes = %w[footer.html googleanalytics.html head.html header.html]
    includes.each do |include_file|
      include_path = File.join(project_root, "_includes", include_file)
      assert File.exist?(include_path), "Missing include: #{include_file}"
    end
  end

  def test_posts_have_required_front_matter_and_body
    post_paths = Dir.glob(File.join(project_root, "_posts", "**", "*.md"))
    assert post_paths.any?
    post_paths.each do |post_path|
      front_matter = parse_front_matter(post_path)
      assert front_matter.key?("layout"), "Missing layout in #{post_path}"
      assert front_matter.key?("title"), "Missing title in #{post_path}"
      assert front_matter.key?("date"), "Missing date in #{post_path}"
      content = extract_body_content(post_path)
      assert content.strip.length.positive?
    end
  end

  def test_pages_have_required_front_matter
    page_paths = Dir.glob(File.join(project_root, "_pages", "**", "*.md"))
    assert page_paths.any?
    page_paths.each do |page_path|
      front_matter = parse_front_matter(page_path)
      assert front_matter.key?("layout"), "Missing layout in #{page_path}"
      assert front_matter.key?("title"), "Missing title in #{page_path}"
    end
  end

  def test_jekyll_build_generates_expected_pages
    Dir.mktmpdir do |output_directory|
      build_site(output_directory)
      expected_paths = %w[index.html 404.html sitemap.xml]
      expected_paths.each do |relative_path|
        output_path = File.join(output_directory, relative_path)
        assert File.exist?(output_path), "Missing output: #{relative_path}"
      end
    end
  end
end
