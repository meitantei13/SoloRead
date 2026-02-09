class BookSerializer < ActiveModel::Serializer
  attributes :id, :title, :author, :content, :status, :read_date, :genre_id, :genre_name
  belongs_to :user, serializer: UserSerializer

  def status
    object.status_i18n
  end

  def genre_name
    object.genre&.name
  end
end
