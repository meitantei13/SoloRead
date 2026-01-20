class BookSerializer < ActiveModel::Serializer
  attributes :id, :title, :author, :content, :read_date, :status, :genre_id, :genre_name
  belongs_to :user, Serializer: UserSerializer

  def status
    object.status_i18n
  end

  def genre_name
    object.genre&.name
  end
end
