#vim: set filetype=ruby:
unless defined? Bundler
    require 'rubygems'
    require 'bundler'
end
Bundler.require
class CivServer < Sinatra::Base
    set :public, "."
    post '/save' do 
        File.open('map.json.js',"w") do |file|
            file.puts params[:map]
        end
    end
    get '/' do
        File.read('index.html')
    end
    get '/editor' do
        File.read('index.html').gsub('GameApp.js','EditorApp.js')
    end
end
run CivServer
