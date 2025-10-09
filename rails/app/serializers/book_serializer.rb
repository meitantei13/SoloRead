class BookSerializer < ActiveModel::Serializer
  attributes :id, :title, :author, :content, :read_date, :status
  belongs_to :user, Serializer: UserSerializer

  def status
    object.status_i18n
  end
end
