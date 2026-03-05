class BookSerializer < ActiveModel::Serializer
  attributes :id, :title, :author, :content, :status, :read_date, :genre_id, :genre_name, :image_url, :cover_image
  belongs_to :user, serializer: UserSerializer

  def status
    object.status_i18n
  end

  def genre_name
    object.genre&.name
  end

  def cover_image
    return nil unless object.cover_image.attached?

    Rails.application.routes.url_helpers.rails_blob_url(object.cover_image, only_path: false)
  end
end
