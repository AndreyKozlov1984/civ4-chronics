#vim: set filetype=ruby:
unless defined? Bundler
    require 'rubygems'
    require 'bundler'
end
Bundler.require
require 'active_record'

#simple save/load
class Map < ActiveRecord::Base
end
module MapRepo
    extend self
    def get_map(name)
        map = Map.find_by_name name
        if !map then
            map = Map.create :name => name, :value=> File.read('map.json.js')
        end
        map.value
    end
    def save_map(name,value)
        map = Map.find_by_name name
        map = Map.create :name => name unless map
        map.value = value
        map.save!
    end
end

configure :development do
    require 'sqlite3'
    MY_DB_NAME = "development"
    MY_DB = SQLite3::Database.new(MY_DB_NAME)
    # get active record set up
    ActiveRecord::Base.establish_connection(:adapter => 'sqlite3', :database => MY_DB_NAME)
    if !Map.table_exists?
       ActiveRecord::Base.connection.create_table(:maps) do |t|
          t.column :name, :string
          t.column :value, :string, :limit => 100000
       end
    end	
end
configure :production do
     dbconfig = YAML.load(File.read('config/database.yml'))
     ActiveRecord::Base.establish_connection dbconfig['production']
    if !Map.table_exists?
       ActiveRecord::Base.connection.create_table(:maps) do |t|
          t.column :name, :string
          t.column :value, :string, :limit => 100000
       end
    end	
end

class CivServer < Sinatra::Base
    set :public, "."
    helpers do
        def map_file
            return "resources/maps/#{params[:name]}.js"
        end
    end
    post '/save/:name' do |name|
        puts "saving #{name}"
        if development? && File.exists?(map_file)
            puts "saving to file"
            File.open(map_file,"w") do |file|
                file.puts params[:map]
            end
        else
            puts "saving to db"
            MapRepo.save_map name,params[:map]
        end
    end
    get '/load/:name' do |name|
        File.read(map_file) rescue MapRepo.get_map(name) 
    end
    get '/' do
        File.read('index.html')
    end
    get '/editor' do
        File.read('index.html').gsub('GameApp.js','EditorApp.js')
    end
end
run CivServer
