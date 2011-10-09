require 'rubygems'
require 'json'
tiles = ['hills','water']
rows = 10
columns = 20
data = {
    "tiles" => (0..rows).to_a.map do |row|
        (0..columns).to_a.map do |column|
            {:tile => tiles.choice()}
        end
    end
}
File.open('map.json','w') do |f|
    f.puts(data.to_json)
end
