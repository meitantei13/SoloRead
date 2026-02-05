class BookSerializer < ActiveModel::Serializer
  attributes :id, :title, :author, :content, :status, :read_date
  belongs_to :user, serializer: UserSerializer

  def status
    object.status_i18n
  end
end
