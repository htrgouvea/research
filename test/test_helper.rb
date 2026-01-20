require "minitest/autorun"
require "yaml"
require "date"
require "fileutils"
require "open3"
require "shellwords"
require "tmpdir"

module SiteTestSupport
  def project_root
    File.expand_path("..", __dir__)
  end

  def load_config
    config_path = File.join(project_root, "_config.yml")
    YAML.safe_load(File.read(config_path))
  end

  def parse_front_matter(file_path)
    content = File.read(file_path)
    match = content.match(/\A---\s*\n(.*?)\n---\s*\n/m)
    assert match, "Missing front matter in #{file_path}"
    YAML.safe_load(match[1], permitted_classes: [Date])
  end

  def extract_body_content(file_path)
    content = File.read(file_path)
    match = content.match(/\A---\s*\n.*?\n---\s*\n(.*)\z/m)
    assert match, "Missing body content in #{file_path}"
    match[1]
  end

  def build_site(output_directory)
    destination = Shellwords.escape(output_directory)
    command = "bundle exec jekyll build --destination #{destination}"
    stdout, stderr, status = Open3.capture3(command)
    assert status.success?, "Jekyll build failed: #{stderr}\n#{stdout}"
  end
end
