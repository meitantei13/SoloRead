class NoteSerializer < ActiveModel::Serializer
  attributes :id, :content, :book_id
end