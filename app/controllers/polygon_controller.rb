class PolygonController < ApplicationController

  before_action :check_polygon, only:[:map]
  before_action :set_map, only: [:destroy, :update_polygon]
  before_action :token_authentication, only: [:service_areas]

  def map
    @map = Polygon.all.order(:name)
    if @map.present?
      @hash = []
      @map.each do |map|
        poly = Gmaps4rails.build_markers(map.polygons_list) do |polygon, point|
          point.lat polygon[1]['lat']
          point.lng polygon[1]['lng']
        end
        @hash.push(poly)
      end
    end
  end

def check_service_area
  if params[:lat].present? && params[:lng].present?
    @maps = Polygon.all
    @result = []
    @maps.each do |map|
      @a = []
      map.polygons.each do |m|
        lat = m[1]['lat'].to_f
        lng = m[1]['lng'].to_f
        @a<< Geokit::LatLng.new(lat,lng)
      end

      polygon = Geokit::Polygon.new(@a)
      point = Geokit::LatLng.new(params[:lat],params[:lng])
      @result << polygon.contains?(point)
    end
   if @result.include?(true)
    return  render json: {message: "Service is available in this area"}, status: 200
   else
    return render json: {message: "service is currently not available in your area"}, status: 200
   end
  end
end

  def destroy
    @map.destroy
    respond_to do |format|
      format.html { redirect_to root_path(), notice: 'Polygon deleted successfully.' }
      format.json { head :no_content }
    end
  end

  def save_polygon
    @map = Polygon.create(name: params[:name], polygons_list: params[:polygons])
  end

  def update_polygon
    @map.polygons = params[:polygons]
    @map.save
  end

  def service_areas
    @rate = Config.find_by_title('Cross Region Rate')
    @service_areas = Polygon.all
  end

  private
    def check_polygon
      return if params[:name].present? && params[:polygons].present?
    end

    def set_map
      @map = Polygon.find(params[:id])
    end
end
