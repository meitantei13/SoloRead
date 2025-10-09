class BookSerializer < ActiveModel::Serializer
  attributes :id, :title, :author, :content, :read_date
  belongs_to :user, Serializer: UserSerializer
end
