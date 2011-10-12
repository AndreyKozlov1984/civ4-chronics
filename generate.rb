require 'rubygems'
require 'json'
tiles = ['hills','water']
types = ['pikeman','archer','maceman']
sides = (0..1).to_a
rows = 10
columns = 20
data = {
    "tiles" => (0..rows).to_a.map do |row|
        (0..columns).to_a.map do |column|
            {:tile => tiles.choice(),
             :unit => rand() > 0.9 ? {
                :type => types.choice(),
                :side => sides.choice()
            }:nil
            }
        end
    end
}
File.open('map.json','w') do |f|
    f.puts(data.to_json)
end
