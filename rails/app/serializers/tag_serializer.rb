class TagSerializer < ActiveModel::Serializer
  attributes :id, :name, :is_default
end
