class NoteSerializer < ActiveModel::Serializer
  attributes :id, :content, :book_id, :book_title, :created_at
  has_many :tags, serializer: TagSerializer

  def book_title
    object.book.title
  end
end
