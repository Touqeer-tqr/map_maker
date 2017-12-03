class CreatePolygons < ActiveRecord::Migration
  def change
    create_table :polygons do |t|
      t.string :name
      t.text :polygons_list

      t.timestamps null: false
    end
  end
end
