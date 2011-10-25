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
    def get_map
        map = Map.find_by_name 'TheOne'
        if !map then
            map = Map.create :name => 'TheOne', :value=> File.read('map.json.js')
        end
        map.value
    end
    def save_map(value)
        map = Map.find_by_name 'TheOne'
        map = Map.create :name => 'TheOne' unless map
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
configure do
    # do a quick pseudo migration.  This should only get executed on the first run
end

class CivServer < Sinatra::Base
    set :public, "."
    post '/save' do 
        MapRepo.save_map params[:map]
    end
    get '/load' do
        MapRepo.get_map
    end
    get '/' do
        File.read('index.html')
    end
    get '/editor' do
        File.read('index.html').gsub('GameApp.js','EditorApp.js')
    end
end
run CivServer
