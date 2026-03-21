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

    object.cover_image.variant(resize_to_limit: [400, 600], format: :webp).processed.url(expires_in: 1.hour)
  end
end
